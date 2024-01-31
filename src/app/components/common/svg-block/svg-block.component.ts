import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './svg-block.component.html',
  styleUrl: './svg-block.component.scss'
})
export class SvgBlockComponent { 
  @Input()
  color!:string

}
